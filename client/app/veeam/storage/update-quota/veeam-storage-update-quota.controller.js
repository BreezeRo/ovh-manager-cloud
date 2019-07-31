(() => {
  class VeeamStorageUpdateQuotaCtrl {
    constructor($uibModalInstance, currentQuota, inventoryName,
      serviceName, CucControllerHelper, VeeamService) {
      this.$uibModalInstance = $uibModalInstance;
      this.currentQuota = currentQuota;
      this.inventoryName = inventoryName;
      this.serviceName = serviceName;
      this.CucControllerHelper = CucControllerHelper;
      this.VeeamService = VeeamService;

      this.capabilities = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.VeeamService.getCapabilities(this.serviceName),
      });
    }

    $onInit() {
      this.newQuota = this.currentQuota;
      this.capabilities.load();
    }

    confirm() {
      this.updateQuota = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.VeeamService
          .updateRepositoryQuota(this.serviceName, this.inventoryName, this.newQuota)
          .then(response => this.$uibModalInstance.close(response))
          .catch(response => this.$uibModalInstance.dismiss(response)),
      });
      return this.updateQuota.load();
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }
  }

  angular.module('managerApp').controller('VeeamStorageUpdateQuotaCtrl', VeeamStorageUpdateQuotaCtrl);
})();
