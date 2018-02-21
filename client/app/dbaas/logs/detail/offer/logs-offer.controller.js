class LogsOfferCtrl {
    constructor ($stateParams, $window, ControllerHelper, LogsOfferConstant, LogsOfferService, LogsOrderService, OrderHelperService) {
        this.$stateParams = $stateParams;
        this.serviceName = this.$stateParams.serviceName;
        this.LogsOfferService = LogsOfferService;
        this.LogsOrderService = LogsOrderService;
        this.ControllerHelper = ControllerHelper;
        this.OrderHelperService = OrderHelperService;
        this.LogsOfferConstant = LogsOfferConstant;
        this.$window = $window;
        this.offerDetail = {
            quantity: 1,
            selectedOffer: "",
            currentOffer: "",
            currentOfferType: "basic"
        };
        this._initLoaders();
    }

    $onInit () {
        this.getSelectedPlan.load();
        this.offers.load();
    }

    _initLoaders () {
        this.getSelectedPlan = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.LogsOfferService.getOffer(this.serviceName)
                .then(selectedPlan => this.selectOffer(selectedPlan))
        });

        this.offers = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.LogsOrderService.getOrder(this.serviceName)
        });
    }

    selectOffer (offerObj) {
        this.offerDetail.selectedOffer = offerObj.reference;
        this.offerDetail.currentOffer = offerObj.reference;
        if (offerObj.reference !== this.LogsOfferConstant.basicOffer) {
            this.offerDetail.currentOfferType = "pro";
        }
    }

    processOrder () {
        this.savingOffer = this.ControllerHelper.request.getArrayLoader({
            loaderFunction: () => this.LogsOrderService.saveOrder(this.serviceName, this.offerDetail)
                .then(response => this.$window.open(response.order.url, "_self"))
        });
        this.savingOffer.load();
    }

    saveOffer () {
        if (this.offerDetail.selectedOffer === this.offerDetail.currentOffer) {
            this.LogsOfferService.showWarning();
        } else {
            this.processOrder();
        }
    }
}

angular.module("managerApp").controller("LogsOfferCtrl", LogsOfferCtrl);
