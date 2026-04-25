import Common "common";

module {
  public type OrderItem = {
    pesticide_id : Text;
    name : Text;
    price : Float;
    quantity : Nat;
    unit : Text;
  };

  public type OrderStatus = { #pending; #confirmed; #shipped; #delivered; #cancelled };

  public type Order = {
    id : Text;
    items : [OrderItem];
    total_amount : Float;
    status : OrderStatus;
    delivery_address : Text;
    phone : Text;
    notes : Text;
    created_at : Common.Timestamp;
    user_id : Common.UserId;
  };

  public type CreateOrderInput = {
    items : [OrderItem];
    total_amount : Float;
    delivery_address : Text;
    phone : Text;
    notes : Text;
  };
};
