export interface Address{
    "ISO3166-2-lvl8": string,
    country: string,
    country_code: string,
    hamlet: string,
    postcode: string,
    town: string,
    village: string,
}

export interface Extratags{
    image: string,
}

export interface MapResponse{
    address: Address,
    osm_id: number,
    osm_type: string,
    extratags?: Extratags,
}