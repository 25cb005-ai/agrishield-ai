import List "mo:core/List";
import Int "mo:core/Int";
import OrderTypes "../types/order";
import Common "../types/common";

module {
  public type State = List.List<OrderTypes.Order>;

  public func listByUser(
    state : State,
    user_id : Common.UserId,
  ) : [OrderTypes.Order] {
    state.filter(func(o) { o.user_id == user_id }).toArray();
  };

  public func getById(
    state : State,
    id : Text,
  ) : ?OrderTypes.Order {
    state.find(func(o) { o.id == id });
  };

  public func create(
    state : State,
    input : OrderTypes.CreateOrderInput,
    user_id : Common.UserId,
    created_at : Common.Timestamp,
  ) : OrderTypes.Order {
    let id = user_id # "-order-" # created_at.toText();
    let order : OrderTypes.Order = {
      id;
      items = input.items;
      total_amount = input.total_amount;
      status = #pending;
      delivery_address = input.delivery_address;
      phone = input.phone;
      notes = input.notes;
      created_at;
      user_id;
    };
    state.add(order);
    order;
  };
};
