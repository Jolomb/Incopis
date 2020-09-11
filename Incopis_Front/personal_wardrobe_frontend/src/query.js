
import gql from "graphql-tag";

export const BRAND_LIST_QUERY = gql`
    query brands{
        brands{
            name, id
        }
    }
`;
    