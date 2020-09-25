
import gql from "graphql-tag";

export const BRAND_LIST_QUERY = gql`
    query brands{
        allBrands{
            name, id
        }
    }
`;

export const ITEMS_BY_BRAND_QUERY = gql`
    query items($brandId: ID!){
        itemsByBrand(brandId: $brandId) {
            description
            price
        }
    }
`;
    