// burger constructor
function Burger(name) {
    this.name = name;
    this.price = 0;
    this.quantity = 1;
    this.toppings = [];
}

// set burger size
Burger.prototype.setSize = function (size) {
    const burgerSize = burgerSizes.find((burgerSize) => burgerSize.size == size);
    if (burgerSize) {
        this.size = burgerSize;
        this.calculateTotal();
    }
};

//set burger crust
Burger.prototype.setCrust = function (name) {
    const burgerCrust = burgerCrusts.find((burgerCrust) => burgerCrust.name == name);
    if (burgerCrust) {
        this.crust = burgerCrust;
        this.calculateTotal();
    }
};

Burger.prototype.setTopings = function (toppings) {
    this.toppings = toppings;
    this.calculateTotal();
};

//set quantity
Burger.prototype.setQuantity = function (quantity) {
    this.quantity = +quantity;
    this.calculateTotal();
};

// calculate burger total
Burger.prototype.calculateTotal = function () {
    const toppingPrice = 50;

    if (this.size) {
        this.price = this.size.price;
    }

     if (this.crust) {
        this.price = this.price + this.crust.price;
    }

    // add the price of toppings
    this.price += this.toppings.length * toppingPrice;

    this.price *= this.quantity;
};

// burger sizes
const BurgerSizes = [
    {
        size: "small",
        price: 460,
    },
    {
        size: "medium",
        price: 750,
    },
    {
        size: "large",
        price: 1000,
    },
];

// burger crusts
const burgerCrusts = [
    {
        name: "crispy",
        price: 200,
    },
    {
        name: "stuffed",
        price: 150,
    },
    {
        name: "Glutten free",
        price: 180,
    },
];

//toppings
const burgerToppings = ["Cheese", "French onion", "Caesar"];

const Burger = [
    { name: "Chicken Burger" },
    { name: "Beef burger" },
    { name: "Pampa burger" },
    { name: "French burger" },
    { name: "Italian burger" },
    { name: "Crunchy burger" },
];

$(function () {
    // append burgers
    burger.forEach((burger) => {
        $("#burger").append(`<option value="${burger.name}">${burger.name}</option>`);
    });
    // append burger sizes
    burgerSizes.forEach((burgerSize) => {
        $("#size").append(
            `<option value="${burgerSize.size}">${burgerSize.size}-${burgerSize.price}</option>`
        );
    });

    // append burger crusts
    burgerCrusts.forEach((burgerCrust) => {
        $("#crust").append(
            `<option value="${burgerCrust.name}">${burgerCrust.name}-${burgerCrust.price}</option>`
        );
    });

    //append burger toppings
    burgerToppings.forEach((topping) => {
        $(".toppings").append(`<div class="col-md-6">
        <div class="form-check">
          <input class="form-check-input" name="toppings[]" type="checkbox" id="${topping}" value="${topping}">
          <label class="form-check-label" for="${topping}">
              ${topping}
          </label>
          </div>
        </div>`);
    });

    // function to calculate grand total
    function calculateGrandTotal() {
        let total = 0;
        cart.forEach((pizza) => {
            total += pizza.price;
        });

        $(".grand-total").html(`Ksh <span class="text-bold">${total}</span> `);

    }

    // initialize an empty cart
    const cart = [];
    // check if cart is empty
    if (cart.length == 0) {
        $(".empty-cart").show();
        $(".delivery-button").hide();
    } else {
        $(".empty-cart").hide();
    }
    $("#order-form").on("submit", function (e) {
        //prevent default action
        e.preventDefault();

        const selectedburgerName = $("#burger").val();
        const selectedSize = $("#size").val();
        const selectedCrust = $("#crust").val();
        const selectedToppings = $("input[name='toppings[]']:checkbox:checked")
            .map(function () {
                return $(this).val();
            })
            .get();
        // validation for all fields
        if (!selectedBurgerName || !selectedSize || !selectedCrust) {
            $("#error").text("** Please select a burger, size and crust 🙂** ");
            return;
        } else {
            $("#error").text("");
        }
        // cart details
        //check if selected burger exists in cart
        const cartBurger = cart.find((burger) => {
            const sameToppings =
                JSON.stringify(burger.toppings) == JSON.stringify(selectedToppings);

            return (
                burger.name == selectedPizzaName &&
                burger.size.size == selectedSize &&
                sameToppings
            );
        });
        //if it exists increase quantity
        if (cartBurger) {
            cartBurger.setQuantity(cartBurger.quantity + 1);
        } else {
            const burger = new burger(selectedBurgerName);
            burger.setSize(selectedSize);
            burger.setCrust(selectedCrust);
            burger.setTopings(selectedToppings);

            cart.push(burger);
        }
        // empty tbody first
        $(".order-table tbody").html("");
        //loop and append
        cart.forEach((burger, cartIndex) => {
            $(".order-table tbody").append(`
            <tr>
                <td>${burger.name}</td>
                <td>${burger.size.size}</td>
                <td>${burger.crust.name}</td>
                <td>${burger.toppings.join(", ")}</td>
                <td>
                    <input type="number" min="1" class="input-sm form-control burger-quantity" data-cart-index="${cartIndex}" value="${burger.quantity
                }" />
                </td>
                <td>Ksh ${burger.price}</td>
            </tr>
        `);
            // show checkout button
            $(".delivery-button").show();
            // console.log(burger);
            //update grand total
            calculateGrandTotal();

        });

    });
    //burger quantity change event
    $("body").on("change", ".burger-quantity", function () {
        const quantity = $(this).val();
        const cartIndex = $(this).data("cart-index");
        const burger = cart[cartIndex];

        if (quantity > 0) {
            burger.setQuantity(quantity);
            // update line total
            $(this).parent().next().html(`Ksh <span class="text-bold">${burger.price}</span> `);
        }

        //update grand total
        calculateGrandTotal();
    });

    // delivery modal
    $("#delivery-form").on("submit", function (e) {
        //prevent default action
        e.preventDefault();
        // check if the user has selected the radio button
        const selectd = $("input[name='deliveryMethod']:checked");
        if (selectd.val() == undefined) {
            $(".delivery-option").html("<p class='text-danger'>** Please select the delivery method **</p>");
            return;
        } else {
            $(".delivery-option").text("");
            // check which radio button was selected
            if (selectd.val() == "delivery") {
                $("#location-input-details").show();
                // user inputs variables
                const customerName = $("#customerName").val();
                const customerPhone = $("#customerPhone").val();
                const customerLocation = $("#customerLocation").val();
                const additionalInfo = $("#additionalInfo").val();
                // validate user inputs
                if (!customerName || !customerPhone || !customerLocation) {
                    $(".error-delivery-location").text("Fill in all input fields with * to proceed!")
                    return;
                } else {
                    $(".error-delivery-location").text("");
                }
                function calculateGrandTotal() {
                    let total = 0;
                    cart.forEach((burger) => {
                        total += burger.price;
                    });
                    const getTotalPlusDeliveryFee = total + 128;
                    console.log(getTotalPlusDeliveryFee);
                    console.log(cart);
                    $("#select-delivery-method").hide();
                    $(".delivery-head").append(`
                    <div class="alert alert-success" role="alert">Hello ${customerName}. Hello. Order successfully placed. Your order will be delivered to your location(${customerLocation})🙂</div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5>Order Summary </h5>
                            </div>
                            <div>
                                <p class="color-palace float-right">Total Ksh <span class="text-bold">${getTotalPlusDeliveryFee}</span></p>
                            </div>
                        </div>
                    `);
                    //loop and append
                    cart.forEach((burger, cartIndex) => {
                        $(".delivery-bottom").append(`
                        <div>
                        <div class="row">
                            <div class="col-md-12">
                                <ol class="list-group">
                                    <li class="list-group-item d-flex justify-content-between align-items-start">
                                        <div class="ms-2 me-auto">
                                            <div class="fw-bold">${burger.name}(${burger.size.size})</div>
                                            Crust - ${burger.crust.name} <br>
                                            Toppings - ${burger.toppings.join(", ")}
                                        </div>
                                        <span class="badge bg-primary rounded-pill">${burger.quantity}</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                       </div>
                        `);
                    });

                }
                calculateGrandTotal()
                // $("#deliveryMethodModal").hide();
            } else if (selectd.val() == "pickup") {
                function calculateGrandTotal() {
                    let total = 0;
                    cart.forEach((burger) => {
                        total += burger.price;
                    });
                    const getTotalPlusDeliveryFee = total;
                    console.log(getTotalPlusDeliveryFee);
                    $("#select-delivery-method").hide();
                    $(".delivery-head").append(`
                    <div class="alert alert-success" role="alert">Hello. Order successfully placed. Your order will be ready for pick up in an hour 🙂</div>
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5>Order Summary </h5>
                            </div>
                            <div>
                                <p class="color-palace float-right">Total Ksh <span class="text-bold">${getTotalPlusDeliveryFee}</span></p>
                            </div>
                        </div>
                    `);
                    //loop and append
                    cart.forEach((pizza, cartIndex) => {
                        $(".delivery-bottom").append(`
                        <div>
                        <div class="row">
                            <div class="col-md-12">
                                <ol class="list-group">
                                    <li class="list-group-item d-flex justify-content-between align-items-start">
                                        <div class="ms-2 me-auto">
                                            <div class="fw-bold">${burger.name}(${burger.size.size})</div>
                                            Crust - ${burger.crust.name} <br>
                                            Toppings - ${burger.toppings.join(", ")}
                                        </div>
                                        <span class="badge bg-primary rounded-pill">${burger.quantity}</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                       </div>
                        `);
                    });

                }
                calculateGrandTotal()
            }
        }

    })
});
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f129388019msh3ed660ad8fd434dp13ac8ejsn839fb9108ff6',
		'X-RapidAPI-Host': 'burgers1.p.rapidapi.com'
	}
};

fetch('https://burgers1.p.rapidapi.com/burgers', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));