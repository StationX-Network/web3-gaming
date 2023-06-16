export const QUERY_ALL_LENDS = (daoAddress) => {
  return `query {
              lends(where: {lenderAddress: "${daoAddress}"}) {
                  id
                  is721
                  lenderAddress
                  nftAddress
                  lendAmount
                  tokenID
                  lendingID
                  maxRentDuration
                  dailyRentPrice
              }
      }`;
};

export const QUERY_ALL_RENTS = () => {
  return `query{
  rents(orderBy: rentedAt, orderDirection: desc, first: 100) {
    id
    renterAddress
    lendingID
    rentingID
    rentAmount
    rentDuration
    rentedAt
  }
      }`;
};
