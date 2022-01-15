import {
  CryptoCoinClient,
  CryptoHoldingClient,
  CryptoInvestmentClient,
  CryptoSaleClient,
} from ".";

const CryptoInvestmentApi = new CryptoInvestmentClient();
const CryptoCoinApi = new CryptoCoinClient();
const CryptoHoldingApi = new CryptoHoldingClient();
const CryptoSaleApi = new CryptoSaleClient();

export { CryptoInvestmentApi, CryptoCoinApi, CryptoHoldingApi, CryptoSaleApi };
