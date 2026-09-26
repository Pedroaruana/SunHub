// o Cesium le isto de window antes de carregar os proprios workers, entao tem
// que ser script normal e vir antes do modulo. ficou em arquivo proprio, e nao
// inline no html, porque a CSP de producao nao libera script inline
window.CESIUM_BASE_URL = '/cesium'
