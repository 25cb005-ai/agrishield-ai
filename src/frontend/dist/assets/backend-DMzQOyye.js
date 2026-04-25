var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { ab as ProtocolError, ac as TimeoutWaitingForResponseErrorCode, ad as utf8ToBytes, ae as ExternalError, af as MissingRootKeyErrorCode, ag as Certificate, ah as lookupResultToBuffer, ai as RequestStatusResponseStatus, aj as UnknownError, ak as RequestStatusDoneNoReplyErrorCode, al as RejectError, am as CertifiedRejectErrorCode, an as UNREACHABLE_ERROR, ao as InputError, ap as InvalidReadStateRequestErrorCode, aq as ReadRequestType, ar as Principal, as as IDL, at as MissingCanisterIdErrorCode, au as HttpAgent, av as encode, aw as QueryResponseStatus, ax as UncertifiedRejectErrorCode, ay as isV3ResponseBody, az as isV2ResponseBody, aA as UncertifiedRejectUpdateErrorCode, aB as UnexpectedErrorCode, aC as decode, J as Subscribable, aD as pendingThenable, aE as resolveEnabled, K as shallowEqualObjects, aF as resolveStaleTime, Q as noop, aG as environmentManager, aH as isValidTimeout, aI as timeUntilStale, aJ as timeoutManager, aK as focusManager, aL as fetchState, aM as replaceData, O as notifyManager, r as reactExports, T as shouldThrowError, I as useQueryClient, aN as useInternetIdentity, aO as createActorWithConfig, aP as Variant, aQ as Record, aR as Vec, aS as Service, aT as Func, aU as Opt, aV as Text, aW as Null, aX as Nat, aY as Bool, aZ as Int, a_ as Float64 } from "./index-Vk38G6iG.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const Severity$1 = Variant({
  "low": Null,
  "high": Null,
  "critical": Null,
  "moderate": Null
});
const CreateDiagnosisInput = Record({
  "quality_status": Text,
  "image_url": Text,
  "treatment": Text,
  "pesticide_recommendation": Text,
  "fertilizer_recommendation": Text,
  "notes": Text,
  "consult_expert": Bool,
  "symptoms": Vec(Text),
  "severity": Severity$1,
  "confidence": Nat,
  "crop_name": Text,
  "disease_name": Text
});
const Timestamp = Int;
const UserId = Text;
const CropDiagnosis = Record({
  "id": Text,
  "quality_status": Text,
  "image_url": Text,
  "treatment": Text,
  "created_at": Timestamp,
  "pesticide_recommendation": Text,
  "fertilizer_recommendation": Text,
  "user_id": UserId,
  "notes": Text,
  "consult_expert": Bool,
  "symptoms": Vec(Text),
  "severity": Severity$1,
  "confidence": Nat,
  "crop_name": Text,
  "disease_name": Text
});
const OrderItem = Record({
  "name": Text,
  "unit": Text,
  "quantity": Nat,
  "price": Float64,
  "pesticide_id": Text
});
const CreateOrderInput = Record({
  "total_amount": Float64,
  "notes": Text,
  "delivery_address": Text,
  "phone": Text,
  "items": Vec(OrderItem)
});
const OrderStatus$1 = Variant({
  "shipped": Null,
  "cancelled": Null,
  "pending": Null,
  "delivered": Null,
  "confirmed": Null
});
const Order = Record({
  "id": Text,
  "status": OrderStatus$1,
  "total_amount": Float64,
  "created_at": Timestamp,
  "user_id": UserId,
  "notes": Text,
  "delivery_address": Text,
  "phone": Text,
  "items": Vec(OrderItem)
});
const PesticideCategory$1 = Variant({
  "biopesticide": Null,
  "other": Null,
  "herbicide": Null,
  "rodenticide": Null,
  "fungicide": Null,
  "insecticide": Null
});
const Pesticide = Record({
  "id": Text,
  "suitable_for": Vec(Text),
  "active_ingredient": Text,
  "image_url": Text,
  "name": Text,
  "unit": Text,
  "description": Text,
  "stock": Nat,
  "category": PesticideCategory$1,
  "is_available": Bool,
  "brand": Text,
  "price": Float64
});
const CropCategory$1 = Variant({
  "fiber": Null,
  "fruit": Null,
  "cereal": Null,
  "other": Null,
  "oilseed": Null,
  "spice": Null,
  "pulse": Null,
  "vegetable": Null
});
const QualityGrade$1 = Variant({
  "a": Null,
  "b": Null,
  "c": Null,
  "aplus": Null,
  "rejected": Null
});
const HealthStatus$1 = Variant({
  "contaminated": Null,
  "certified": Null,
  "untreated": Null,
  "treated": Null
});
const SeedBatch = Record({
  "id": Text,
  "batch_number": Text,
  "manufacturer": Text,
  "certified_date": Int,
  "crop_category": CropCategory$1,
  "quality_grade": QualityGrade$1,
  "health_status": HealthStatus$1,
  "germination_rate": Nat,
  "seed_type": Text,
  "purity_percentage": Nat
});
Service({
  "createDiagnosis": Func([CreateDiagnosisInput], [CropDiagnosis], []),
  "createOrder": Func([CreateOrderInput], [Order], []),
  "deleteDiagnosis": Func([Text], [Bool], []),
  "getDiagnosis": Func([Text], [Opt(CropDiagnosis)], ["query"]),
  "getOrder": Func([Text], [Opt(Order)], ["query"]),
  "getPesticide": Func([Text], [Opt(Pesticide)], ["query"]),
  "getSeedBatch": Func([Text], [Opt(SeedBatch)], ["query"]),
  "listDiagnosesByUser": Func([], [Vec(CropDiagnosis)], ["query"]),
  "listOrdersByUser": Func([], [Vec(Order)], ["query"]),
  "listPesticides": Func([], [Vec(Pesticide)], ["query"])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const Severity2 = IDL2.Variant({
    "low": IDL2.Null,
    "high": IDL2.Null,
    "critical": IDL2.Null,
    "moderate": IDL2.Null
  });
  const CreateDiagnosisInput2 = IDL2.Record({
    "quality_status": IDL2.Text,
    "image_url": IDL2.Text,
    "treatment": IDL2.Text,
    "pesticide_recommendation": IDL2.Text,
    "fertilizer_recommendation": IDL2.Text,
    "notes": IDL2.Text,
    "consult_expert": IDL2.Bool,
    "symptoms": IDL2.Vec(IDL2.Text),
    "severity": Severity2,
    "confidence": IDL2.Nat,
    "crop_name": IDL2.Text,
    "disease_name": IDL2.Text
  });
  const Timestamp2 = IDL2.Int;
  const UserId2 = IDL2.Text;
  const CropDiagnosis2 = IDL2.Record({
    "id": IDL2.Text,
    "quality_status": IDL2.Text,
    "image_url": IDL2.Text,
    "treatment": IDL2.Text,
    "created_at": Timestamp2,
    "pesticide_recommendation": IDL2.Text,
    "fertilizer_recommendation": IDL2.Text,
    "user_id": UserId2,
    "notes": IDL2.Text,
    "consult_expert": IDL2.Bool,
    "symptoms": IDL2.Vec(IDL2.Text),
    "severity": Severity2,
    "confidence": IDL2.Nat,
    "crop_name": IDL2.Text,
    "disease_name": IDL2.Text
  });
  const OrderItem2 = IDL2.Record({
    "name": IDL2.Text,
    "unit": IDL2.Text,
    "quantity": IDL2.Nat,
    "price": IDL2.Float64,
    "pesticide_id": IDL2.Text
  });
  const CreateOrderInput2 = IDL2.Record({
    "total_amount": IDL2.Float64,
    "notes": IDL2.Text,
    "delivery_address": IDL2.Text,
    "phone": IDL2.Text,
    "items": IDL2.Vec(OrderItem2)
  });
  const OrderStatus2 = IDL2.Variant({
    "shipped": IDL2.Null,
    "cancelled": IDL2.Null,
    "pending": IDL2.Null,
    "delivered": IDL2.Null,
    "confirmed": IDL2.Null
  });
  const Order2 = IDL2.Record({
    "id": IDL2.Text,
    "status": OrderStatus2,
    "total_amount": IDL2.Float64,
    "created_at": Timestamp2,
    "user_id": UserId2,
    "notes": IDL2.Text,
    "delivery_address": IDL2.Text,
    "phone": IDL2.Text,
    "items": IDL2.Vec(OrderItem2)
  });
  const PesticideCategory2 = IDL2.Variant({
    "biopesticide": IDL2.Null,
    "other": IDL2.Null,
    "herbicide": IDL2.Null,
    "rodenticide": IDL2.Null,
    "fungicide": IDL2.Null,
    "insecticide": IDL2.Null
  });
  const Pesticide2 = IDL2.Record({
    "id": IDL2.Text,
    "suitable_for": IDL2.Vec(IDL2.Text),
    "active_ingredient": IDL2.Text,
    "image_url": IDL2.Text,
    "name": IDL2.Text,
    "unit": IDL2.Text,
    "description": IDL2.Text,
    "stock": IDL2.Nat,
    "category": PesticideCategory2,
    "is_available": IDL2.Bool,
    "brand": IDL2.Text,
    "price": IDL2.Float64
  });
  const CropCategory2 = IDL2.Variant({
    "fiber": IDL2.Null,
    "fruit": IDL2.Null,
    "cereal": IDL2.Null,
    "other": IDL2.Null,
    "oilseed": IDL2.Null,
    "spice": IDL2.Null,
    "pulse": IDL2.Null,
    "vegetable": IDL2.Null
  });
  const QualityGrade2 = IDL2.Variant({
    "a": IDL2.Null,
    "b": IDL2.Null,
    "c": IDL2.Null,
    "aplus": IDL2.Null,
    "rejected": IDL2.Null
  });
  const HealthStatus2 = IDL2.Variant({
    "contaminated": IDL2.Null,
    "certified": IDL2.Null,
    "untreated": IDL2.Null,
    "treated": IDL2.Null
  });
  const SeedBatch2 = IDL2.Record({
    "id": IDL2.Text,
    "batch_number": IDL2.Text,
    "manufacturer": IDL2.Text,
    "certified_date": IDL2.Int,
    "crop_category": CropCategory2,
    "quality_grade": QualityGrade2,
    "health_status": HealthStatus2,
    "germination_rate": IDL2.Nat,
    "seed_type": IDL2.Text,
    "purity_percentage": IDL2.Nat
  });
  return IDL2.Service({
    "createDiagnosis": IDL2.Func([CreateDiagnosisInput2], [CropDiagnosis2], []),
    "createOrder": IDL2.Func([CreateOrderInput2], [Order2], []),
    "deleteDiagnosis": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "getDiagnosis": IDL2.Func([IDL2.Text], [IDL2.Opt(CropDiagnosis2)], ["query"]),
    "getOrder": IDL2.Func([IDL2.Text], [IDL2.Opt(Order2)], ["query"]),
    "getPesticide": IDL2.Func([IDL2.Text], [IDL2.Opt(Pesticide2)], ["query"]),
    "getSeedBatch": IDL2.Func([IDL2.Text], [IDL2.Opt(SeedBatch2)], ["query"]),
    "listDiagnosesByUser": IDL2.Func([], [IDL2.Vec(CropDiagnosis2)], ["query"]),
    "listOrdersByUser": IDL2.Func([], [IDL2.Vec(Order2)], ["query"]),
    "listPesticides": IDL2.Func([], [IDL2.Vec(Pesticide2)], ["query"])
  });
};
var CropCategory = /* @__PURE__ */ ((CropCategory2) => {
  CropCategory2["fiber"] = "fiber";
  CropCategory2["fruit"] = "fruit";
  CropCategory2["cereal"] = "cereal";
  CropCategory2["other"] = "other";
  CropCategory2["oilseed"] = "oilseed";
  CropCategory2["spice"] = "spice";
  CropCategory2["pulse"] = "pulse";
  CropCategory2["vegetable"] = "vegetable";
  return CropCategory2;
})(CropCategory || {});
var HealthStatus = /* @__PURE__ */ ((HealthStatus2) => {
  HealthStatus2["contaminated"] = "contaminated";
  HealthStatus2["certified"] = "certified";
  HealthStatus2["untreated"] = "untreated";
  HealthStatus2["treated"] = "treated";
  return HealthStatus2;
})(HealthStatus || {});
var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2["shipped"] = "shipped";
  OrderStatus2["cancelled"] = "cancelled";
  OrderStatus2["pending"] = "pending";
  OrderStatus2["delivered"] = "delivered";
  OrderStatus2["confirmed"] = "confirmed";
  return OrderStatus2;
})(OrderStatus || {});
var PesticideCategory = /* @__PURE__ */ ((PesticideCategory2) => {
  PesticideCategory2["biopesticide"] = "biopesticide";
  PesticideCategory2["other"] = "other";
  PesticideCategory2["herbicide"] = "herbicide";
  PesticideCategory2["rodenticide"] = "rodenticide";
  PesticideCategory2["fungicide"] = "fungicide";
  PesticideCategory2["insecticide"] = "insecticide";
  return PesticideCategory2;
})(PesticideCategory || {});
var QualityGrade = /* @__PURE__ */ ((QualityGrade2) => {
  QualityGrade2["a"] = "a";
  QualityGrade2["b"] = "b";
  QualityGrade2["c"] = "c";
  QualityGrade2["aplus"] = "aplus";
  QualityGrade2["rejected"] = "rejected";
  return QualityGrade2;
})(QualityGrade || {});
var Severity = /* @__PURE__ */ ((Severity2) => {
  Severity2["low"] = "low";
  Severity2["high"] = "high";
  Severity2["critical"] = "critical";
  Severity2["moderate"] = "moderate";
  return Severity2;
})(Severity || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async createDiagnosis(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createDiagnosis(to_candid_CreateDiagnosisInput_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid_CropDiagnosis_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createDiagnosis(to_candid_CreateDiagnosisInput_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid_CropDiagnosis_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async createOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createOrder(arg0);
        return from_candid_Order_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOrder(arg0);
      return from_candid_Order_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteDiagnosis(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteDiagnosis(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteDiagnosis(arg0);
      return result;
    }
  }
  async getDiagnosis(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getDiagnosis(arg0);
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDiagnosis(arg0);
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrder(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getOrder(arg0);
        return from_candid_opt_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrder(arg0);
      return from_candid_opt_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPesticide(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPesticide(arg0);
        return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPesticide(arg0);
      return from_candid_opt_n15(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSeedBatch(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getSeedBatch(arg0);
        return from_candid_opt_n20(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSeedBatch(arg0);
      return from_candid_opt_n20(this._uploadFile, this._downloadFile, result);
    }
  }
  async listDiagnosesByUser() {
    if (this.processError) {
      try {
        const result = await this.actor.listDiagnosesByUser();
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listDiagnosesByUser();
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async listOrdersByUser() {
    if (this.processError) {
      try {
        const result = await this.actor.listOrdersByUser();
        return from_candid_vec_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listOrdersByUser();
      return from_candid_vec_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async listPesticides() {
    if (this.processError) {
      try {
        const result = await this.actor.listPesticides();
        return from_candid_vec_n31(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listPesticides();
      return from_candid_vec_n31(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_CropCategory_n23(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n24(_uploadFile, _downloadFile, value);
}
function from_candid_CropDiagnosis_n5(_uploadFile, _downloadFile, value) {
  return from_candid_record_n6(_uploadFile, _downloadFile, value);
}
function from_candid_HealthStatus_n27(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n28(_uploadFile, _downloadFile, value);
}
function from_candid_OrderStatus_n11(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n12(_uploadFile, _downloadFile, value);
}
function from_candid_Order_n9(_uploadFile, _downloadFile, value) {
  return from_candid_record_n10(_uploadFile, _downloadFile, value);
}
function from_candid_PesticideCategory_n18(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n19(_uploadFile, _downloadFile, value);
}
function from_candid_Pesticide_n16(_uploadFile, _downloadFile, value) {
  return from_candid_record_n17(_uploadFile, _downloadFile, value);
}
function from_candid_QualityGrade_n25(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n26(_uploadFile, _downloadFile, value);
}
function from_candid_SeedBatch_n21(_uploadFile, _downloadFile, value) {
  return from_candid_record_n22(_uploadFile, _downloadFile, value);
}
function from_candid_Severity_n7(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n8(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n13(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_CropDiagnosis_n5(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n14(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Order_n9(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n15(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Pesticide_n16(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n20(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_SeedBatch_n21(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n10(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_OrderStatus_n11(_uploadFile, _downloadFile, value.status),
    total_amount: value.total_amount,
    created_at: value.created_at,
    user_id: value.user_id,
    notes: value.notes,
    delivery_address: value.delivery_address,
    phone: value.phone,
    items: value.items
  };
}
function from_candid_record_n17(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    suitable_for: value.suitable_for,
    active_ingredient: value.active_ingredient,
    image_url: value.image_url,
    name: value.name,
    unit: value.unit,
    description: value.description,
    stock: value.stock,
    category: from_candid_PesticideCategory_n18(_uploadFile, _downloadFile, value.category),
    is_available: value.is_available,
    brand: value.brand,
    price: value.price
  };
}
function from_candid_record_n22(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    batch_number: value.batch_number,
    manufacturer: value.manufacturer,
    certified_date: value.certified_date,
    crop_category: from_candid_CropCategory_n23(_uploadFile, _downloadFile, value.crop_category),
    quality_grade: from_candid_QualityGrade_n25(_uploadFile, _downloadFile, value.quality_grade),
    health_status: from_candid_HealthStatus_n27(_uploadFile, _downloadFile, value.health_status),
    germination_rate: value.germination_rate,
    seed_type: value.seed_type,
    purity_percentage: value.purity_percentage
  };
}
function from_candid_record_n6(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    quality_status: value.quality_status,
    image_url: value.image_url,
    treatment: value.treatment,
    created_at: value.created_at,
    pesticide_recommendation: value.pesticide_recommendation,
    fertilizer_recommendation: value.fertilizer_recommendation,
    user_id: value.user_id,
    notes: value.notes,
    consult_expert: value.consult_expert,
    symptoms: value.symptoms,
    severity: from_candid_Severity_n7(_uploadFile, _downloadFile, value.severity),
    confidence: value.confidence,
    crop_name: value.crop_name,
    disease_name: value.disease_name
  };
}
function from_candid_variant_n12(_uploadFile, _downloadFile, value) {
  return "shipped" in value ? "shipped" : "cancelled" in value ? "cancelled" : "pending" in value ? "pending" : "delivered" in value ? "delivered" : "confirmed" in value ? "confirmed" : value;
}
function from_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return "biopesticide" in value ? "biopesticide" : "other" in value ? "other" : "herbicide" in value ? "herbicide" : "rodenticide" in value ? "rodenticide" : "fungicide" in value ? "fungicide" : "insecticide" in value ? "insecticide" : value;
}
function from_candid_variant_n24(_uploadFile, _downloadFile, value) {
  return "fiber" in value ? "fiber" : "fruit" in value ? "fruit" : "cereal" in value ? "cereal" : "other" in value ? "other" : "oilseed" in value ? "oilseed" : "spice" in value ? "spice" : "pulse" in value ? "pulse" : "vegetable" in value ? "vegetable" : value;
}
function from_candid_variant_n26(_uploadFile, _downloadFile, value) {
  return "a" in value ? "a" : "b" in value ? "b" : "c" in value ? "c" : "aplus" in value ? "aplus" : "rejected" in value ? "rejected" : value;
}
function from_candid_variant_n28(_uploadFile, _downloadFile, value) {
  return "contaminated" in value ? "contaminated" : "certified" in value ? "certified" : "untreated" in value ? "untreated" : "treated" in value ? "treated" : value;
}
function from_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return "low" in value ? "low" : "high" in value ? "high" : "critical" in value ? "critical" : "moderate" in value ? "moderate" : value;
}
function from_candid_vec_n29(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CropDiagnosis_n5(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n30(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Order_n9(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n31(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Pesticide_n16(_uploadFile, _downloadFile, x));
}
function to_candid_CreateDiagnosisInput_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_Severity_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    quality_status: value.quality_status,
    image_url: value.image_url,
    treatment: value.treatment,
    pesticide_recommendation: value.pesticide_recommendation,
    fertilizer_recommendation: value.fertilizer_recommendation,
    notes: value.notes,
    consult_expert: value.consult_expert,
    symptoms: value.symptoms,
    severity: to_candid_Severity_n3(_uploadFile, _downloadFile, value.severity),
    confidence: value.confidence,
    crop_name: value.crop_name,
    disease_name: value.disease_name
  };
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "low" ? {
    low: null
  } : value == "high" ? {
    high: null
  } : value == "critical" ? {
    critical: null
  } : value == "moderate" ? {
    moderate: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  CropCategory as C,
  HealthStatus as H,
  OrderStatus as O,
  PesticideCategory as P,
  QualityGrade as Q,
  Severity as S,
  useQuery as a,
  createActor as c,
  useActor as u
};
