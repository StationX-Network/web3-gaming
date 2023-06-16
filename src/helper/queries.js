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

export const QUERY_LENDS_WITH_LENDINGID = (lendingID) => {
  return `query {
      lends(where: {lendingID: "${lendingID}"}) {
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

export const QUERY_RENTS_WITH_LENDINGID = (lendingID) => {
  return `query{
          rents(where: {lendingID: "${lendingID}"}) {
              id
              renterAddress
              lendingID
              rentingID
              rentAmount
              rentedAt
              rentDuration
            }
      }`;
};

export const QUERY_ALL_RENTS = (daoAddress) => {
  return `query{
          rents (where: {renterAddress: "${daoAddress}"}) {
              id
              renterAddress
              lendingID
              rentingID
              rentAmount
              rentedAt
              rentDuration
            }
      }`;
};
