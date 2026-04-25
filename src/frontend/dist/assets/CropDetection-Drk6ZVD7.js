import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, h as Presence, i as Primitive, k as useControllableState, l as useComposedRefs, n as composeEventHandlers, o as createContextScope$1, p as cn, u as useLanguage, C as Card, a as CardContent, b as Leaf, q as CardHeader, s as CardTitle, e as Sprout, B as Button, X, f as Camera, t as useOfflineSync, W as WifiOff } from "./index-Vk38G6iG.js";
import { S as Severity, u as useActor, c as createActor } from "./backend-DMzQOyye.js";
import { C as Check, u as useMutation } from "./check-BO1j24bv.js";
import { C as CircleAlert, u as ue } from "./index-g9WU4RcC.js";
import { B as Badge } from "./badge-BxaTeqsn.js";
import { u as usePrevious, a as useSize } from "./index-C1MCXe_b.js";
import { P as Primitive$1, S as Separator } from "./separator-CJLzNPfw.js";
import { C as CircleCheckBig } from "./circle-check-big-gi55uF63.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
      key: "18mbvz"
    }
  ],
  ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }]
];
const FlaskConical = createLucideIcon("flask-conical", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope$1(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME$1 = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME$1, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME$1;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
const severityConfig = {
  [Severity.low]: {
    label: "Low",
    badgeClass: "badge-low",
    icon: CircleCheckBig
  },
  [Severity.moderate]: {
    label: "Moderate",
    badgeClass: "badge-moderate",
    icon: CircleAlert
  },
  [Severity.high]: {
    label: "High",
    badgeClass: "badge-high",
    icon: CircleAlert
  },
  [Severity.critical]: {
    label: "Critical",
    badgeClass: "badge-critical",
    icon: CircleAlert
  }
};
function DiagnosisResult({
  diagnosis,
  imageUrl,
  isSaving,
  isSaved,
  onSave,
  onDownload,
  onReset
}) {
  const { t } = useLanguage();
  const conf = severityConfig[diagnosis.severity];
  const SeverityIcon = conf.icon;
  const confidenceNum = Number(diagnosis.confidence);
  const needsExpert = diagnosis.severity === Severity.high || diagnosis.severity === Severity.critical;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "diagnosis-result.card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:w-48 h-40 sm:h-auto shrink-0 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: imageUrl,
          alt: "Analyzed crop",
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: t("detect.result") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground mt-0.5", children: diagnosis.disease_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 12, className: "text-primary" }),
              diagnosis.crop_name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: `${conf.badgeClass} px-3 py-1 text-sm font-semibold flex items-center gap-1.5 rounded-full border-0`,
              "data-ocid": "diagnosis-result.severity.badge",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityIcon, { size: 12 }),
                t(
                  `severity.${diagnosis.severity}`
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("detect.confidence") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
              confidenceNum,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: confidenceNum,
              className: "h-2",
              "data-ocid": "diagnosis-result.confidence.progress"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Quality:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: diagnosis.quality_status })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "text-primary" }),
        t("detect.symptoms")
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ul",
        {
          className: "space-y-1.5",
          "data-ocid": "diagnosis-result.symptoms.list",
          children: diagnosis.symptoms.map((sym, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-start gap-2 text-sm text-foreground",
              "data-ocid": `diagnosis-result.symptoms.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" }),
                sym
              ]
            },
            sym
          ))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 14, className: "text-primary" }),
        t("detect.treatment")
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: diagnosis.treatment }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "diagnosis-result.fertilizer.section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { size: 11 }),
              t("detect.fertilizer")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: diagnosis.fertilizer_recommendation })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "diagnosis-result.pesticide.section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { size: 11 }),
              t("detect.pesticide")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: diagnosis.pesticide_recommendation })
          ] })
        ] })
      ] })
    ] }),
    needsExpert && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-destructive/40 bg-destructive/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Checkbox,
        {
          id: "consult-expert",
          checked: diagnosis.consult_expert,
          className: "mt-0.5",
          "data-ocid": "diagnosis-result.consult_expert.checkbox"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "consult-expert",
            className: "text-sm font-semibold text-foreground cursor-pointer",
            children: t("detect.consultExpert")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          "Severity is ",
          conf.label.toLowerCase(),
          " — professional assessment recommended."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap gap-3",
        "data-ocid": "diagnosis-result.actions",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: onSave,
              disabled: isSaving || isSaved,
              className: "gap-2 flex-1 sm:flex-none",
              "data-ocid": "diagnosis-result.save.submit_button",
              children: isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 15 }),
                "Saved"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
                isSaving ? "Saving…" : "Save Diagnosis"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: onDownload,
              className: "gap-2 flex-1 sm:flex-none",
              "data-ocid": "diagnosis-result.download_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 15 }),
                "Download PDF"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: onReset,
              className: "gap-2 flex-1 sm:flex-none text-muted-foreground",
              "data-ocid": "diagnosis-result.new_scan.button",
              children: "Scan Another"
            }
          )
        ]
      }
    )
  ] });
}
function ImageUploader({
  onUploadComplete,
  isUploading,
  setIsUploading
}) {
  const { t } = useLanguage();
  const [preview, setPreview] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const handleFile = reactExports.useCallback(
    async (file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a;
        return setPreview((_a = e.target) == null ? void 0 : _a.result);
      };
      reader.readAsDataURL(file);
      setIsUploading(true);
      setProgress(0);
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        for (let p = 10; p <= 80; p += 10) {
          await new Promise((r) => setTimeout(r, 80));
          setProgress(p);
        }
        const blob = new Blob([bytes], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        setProgress(100);
        await new Promise((r) => setTimeout(r, 300));
        onUploadComplete(blobUrl, file.name);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, setIsUploading]
  );
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  const handleChange = reactExports.useCallback(
    (e) => {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  const clearImage = () => {
    setPreview(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };
  const dropZoneClass = [
    "relative rounded-2xl border-2 border-dashed transition-smooth overflow-hidden",
    "flex flex-col items-center justify-center min-h-[220px]",
    dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-primary/5"
  ].join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onDrop: handleDrop,
        onDragOver: (e) => {
          e.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        "data-ocid": "image-uploader.dropzone",
        className: dropZoneClass,
        children: preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: preview,
              alt: "Crop preview",
              className: "w-full h-full object-cover max-h-[320px]"
            }
          ),
          !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: clearImage,
              className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-destructive transition-smooth",
              "aria-label": "Remove image",
              "data-ocid": "image-uploader.remove_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 30, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t("detect.uploadPrompt") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "JPG, PNG, WebP · up to 20 MB" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "mt-1 gap-2",
              onClick: () => {
                var _a;
                return (_a = inputRef.current) == null ? void 0 : _a.click();
              },
              "data-ocid": "image-uploader.upload_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 14 }),
                "Select File"
              ]
            }
          )
        ] })
      }
    ),
    isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-1",
        "data-ocid": "image-uploader.upload.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("detect.analyzing") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        className: "sr-only",
        onChange: handleChange,
        "data-ocid": "image-uploader.file_input"
      }
    )
  ] });
}
const OFFLINE_QUEUE_KEY = "agrishield_offline_queue";
function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function addToOfflineQueue(item) {
  const queue = getOfflineQueue();
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}
function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}
function OfflineCaptureQueue({ onSync }) {
  const { t } = useLanguage();
  const [queue, setQueue] = reactExports.useState([]);
  const [isSyncing, setIsSyncing] = reactExports.useState(false);
  const [syncDone, setSyncDone] = reactExports.useState(false);
  const { isOnline } = useOfflineSync(() => {
    setQueue(getOfflineQueue());
    setSyncDone(false);
  });
  reactExports.useEffect(() => {
    setQueue(getOfflineQueue());
  }, []);
  if (queue.length === 0 && isOnline) return null;
  const handleSync = async () => {
    if (!onSync || queue.length === 0) return;
    setIsSyncing(true);
    try {
      await onSync(queue);
      clearOfflineQueue();
      setQueue([]);
      setSyncDone(true);
    } finally {
      setIsSyncing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: [
        "border transition-smooth",
        isOnline ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
      ].join(" "),
      "data-ocid": "offline-queue.card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          isOnline ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 18, className: "text-primary shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 18, className: "text-destructive shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: !isOnline ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("offline.banner") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: syncDone ? "All pending diagnoses synced!" : `${queue.length} pending ${queue.length === 1 ? "diagnosis" : "diagnoses"} to sync` }) }),
          queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "shrink-0 font-semibold",
              "data-ocid": "offline-queue.count.badge",
              children: queue.length
            }
          )
        ] }),
        isOnline && queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleSync,
            disabled: isSyncing,
            className: "gap-2 shrink-0",
            "data-ocid": "offline-queue.sync_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 13 }),
              isSyncing ? "Syncing…" : "Sync Now"
            ]
          }
        )
      ] })
    }
  );
}
const DISEASES = [
  {
    name: "Leaf Blight",
    symptoms: [
      "Brown lesions with yellow halos on leaves",
      "Water-soaked spots that expand rapidly",
      "Premature leaf drop in severe cases",
      "Dark brown streaks along leaf margins"
    ],
    treatment: "Apply copper-based fungicide immediately. Remove and destroy infected leaves. Avoid overhead irrigation. Ensure proper crop spacing for air circulation.",
    fertilizer: "Apply balanced NPK 19:19:19 @ 5g/L water. Avoid excess nitrogen.",
    pesticide: "Mancozeb 75 WP @ 2.5g/L or Copper Oxychloride 50 WP @ 3g/L"
  },
  {
    name: "Powdery Mildew",
    symptoms: [
      "White powdery coating on leaf surfaces",
      "Distortion and yellowing of young leaves",
      "Stunted plant growth",
      "Premature leaf senescence",
      "Reduced fruit and seed quality"
    ],
    treatment: "Spray sulfur-based fungicide at first signs. Improve air circulation. Apply neem oil as organic alternative. Repeat treatment every 7-10 days.",
    fertilizer: "Reduce nitrogen; use potassium-rich fertilizer to strengthen cell walls.",
    pesticide: "Hexaconazole 5 SC @ 2ml/L or Propiconazole 25 EC @ 1ml/L"
  },
  {
    name: "Root Rot",
    symptoms: [
      "Wilting despite adequate soil moisture",
      "Yellowing of lower leaves progressing upward",
      "Brown, mushy roots when inspected",
      "Stunted growth and reduced yield",
      "Plant collapse at soil level"
    ],
    treatment: "Improve soil drainage immediately. Remove affected plants. Drench soil with Trichoderma-based biocontrol agent. Avoid waterlogging. Treat seeds before next planting.",
    fertilizer: "Drench with phosphorus-rich fertilizer (DAP) to stimulate root recovery.",
    pesticide: "Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/L soil drench"
  },
  {
    name: "Bacterial Wilt",
    symptoms: [
      "Sudden wilting of plants during midday",
      "Recovery at night initially, then permanent wilt",
      "Milky bacterial ooze from cut stems",
      "Brown discoloration of vascular tissue"
    ],
    treatment: "No chemical cure once infected. Remove and destroy diseased plants. Solarize soil. Use resistant varieties in next season. Control soilborne insects.",
    fertilizer: "Apply calcium and boron to improve cell wall strength in remaining plants.",
    pesticide: "Streptomycin Sulfate 90 SP @ 0.5g/L as preventive spray"
  },
  {
    name: "Mosaic Virus",
    symptoms: [
      "Mottled yellow-green mosaic pattern on leaves",
      "Leaf curling and distortion",
      "Reduced leaf size and plant stunting",
      "Fruit malformation and reduced size",
      "Dark green blistering along leaf veins"
    ],
    treatment: "No direct cure for viral infections. Remove infected plants immediately. Control aphid vectors with insecticide. Use virus-free certified seeds next season.",
    fertilizer: "Foliar spray of micronutrients (Zinc + Boron) to support plant immunity.",
    pesticide: "Imidacloprid 17.8 SL @ 0.5ml/L to control aphid vectors"
  }
];
const SEVERITIES = [
  Severity.low,
  Severity.moderate,
  Severity.high,
  Severity.critical
];
const QUALITY_STATUSES = ["Good", "Fair", "Poor", "Needs Attention"];
function generateCropName(fileName) {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
  const cleaned = base.trim();
  const knownCrops = [
    "rice",
    "wheat",
    "maize",
    "tomato",
    "potato",
    "cotton",
    "sugarcane",
    "chilli",
    "onion",
    "groundnut"
  ];
  const lower = cleaned.toLowerCase();
  for (const crop of knownCrops) {
    if (lower.includes(crop))
      return crop.charAt(0).toUpperCase() + crop.slice(1);
  }
  const fallbacks = ["Tomato", "Rice", "Wheat", "Maize", "Cotton", "Potato"];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
function generateMockDiagnosis(fileName) {
  const disease = DISEASES[Math.floor(Math.random() * DISEASES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const confidence = BigInt(65 + Math.floor(Math.random() * 31));
  const qualityStatus = QUALITY_STATUSES[Math.floor(Math.random() * QUALITY_STATUSES.length)];
  const symptomCount = 3 + Math.floor(Math.random() * 3);
  return {
    crop_name: generateCropName(fileName),
    disease_name: disease.name,
    confidence,
    severity,
    quality_status: qualityStatus,
    consult_expert: severity === Severity.high || severity === Severity.critical,
    symptoms: disease.symptoms.slice(0, symptomCount),
    treatment: disease.treatment,
    fertilizer_recommendation: disease.fertilizer,
    pesticide_recommendation: disease.pesticide,
    notes: `AI-generated diagnosis. Confidence: ${Number(confidence)}%. Always verify with local agricultural expert.`
  };
}
function CropDetection() {
  const { t } = useLanguage();
  const { actor } = useActor(createActor);
  const { isOnline } = useOfflineSync();
  const [state, setState] = reactExports.useState("upload");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [diagnosis, setDiagnosis] = reactExports.useState(null);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [isSaved, setIsSaved] = reactExports.useState(false);
  const { mutate: saveDiagnosis, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!diagnosis) return;
      if (!actor || !isOnline) {
        const item = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
          diagnosis,
          imageUrl
        };
        addToOfflineQueue(item);
        ue.success("Saved offline — will sync when connected.");
        setIsSaved(true);
        return;
      }
      await actor.createDiagnosis({
        ...diagnosis,
        image_url: imageUrl
      });
      ue.success("Diagnosis saved successfully!");
      setIsSaved(true);
    },
    onError: () => {
      ue.error("Failed to save. Please try again.");
    }
  });
  const handleUploadComplete = (url, name) => {
    setImageUrl(url);
    const result = generateMockDiagnosis(name);
    setDiagnosis(result);
    setState("result");
    setIsSaved(false);
  };
  const handleReset = () => {
    setState("upload");
    setImageUrl("");
    setDiagnosis(null);
    setIsSaved(false);
  };
  const handleDownload = () => {
    if (!diagnosis) return;
    const lines = [
      "AgriShield AI — Crop Diagnosis Report",
      "======================================",
      `Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`,
      "",
      `Crop: ${diagnosis.crop_name}`,
      `Disease: ${diagnosis.disease_name}`,
      `Confidence: ${Number(diagnosis.confidence)}%`,
      `Severity: ${diagnosis.severity}`,
      `Quality Status: ${diagnosis.quality_status}`,
      "",
      "Symptoms:",
      ...diagnosis.symptoms.map((s) => `  • ${s}`),
      "",
      "Treatment:",
      `  ${diagnosis.treatment}`,
      "",
      "Fertilizer Recommendation:",
      `  ${diagnosis.fertilizer_recommendation}`,
      "",
      "Pesticide Recommendation:",
      `  ${diagnosis.pesticide_recommendation}`,
      "",
      "Notes:",
      `  ${diagnosis.notes}`,
      "",
      "⚠️  This is an AI-generated report. Verify with a certified agronomist."
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `diagnosis-${diagnosis.crop_name.toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 sm:p-6 space-y-5 max-w-2xl mx-auto",
      "data-ocid": "crop-detection.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: t("detect.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: t("detect.subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OfflineCaptureQueue, {}),
        state === "upload" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageUploader,
          {
            onUploadComplete: handleUploadComplete,
            isUploading,
            setIsUploading
          }
        ) : diagnosis ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagnosisResult,
          {
            diagnosis,
            imageUrl,
            isSaving,
            isSaved,
            onSave: () => saveDiagnosis(),
            onDownload: handleDownload,
            onReset: handleReset
          }
        ) : null
      ]
    }
  );
}
export {
  CropDetection as default
};
