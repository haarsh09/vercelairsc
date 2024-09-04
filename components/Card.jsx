import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
export const Card = ({
  name,
  address,
  imgSrc,
  price,
  countrySlug,
  citySlug,
  slug,
}) => {
  return (
    <div className="w-full bg-white rounded-md">
      <Link
        className="bg-gray-200 rounded-md"
        target="_blank"
        href={`https://www.universityliving.com/${countrySlug}/${citySlug}/property/${slug}`}
      >
        <div className="rounded-md overflow-hidden w-full h-52 relative">
          <Image src={imgSrc} fill />
        </div>
        <div className="p-2">   
          <p className="font-bold mt-2">{name}</p>
          <p className="text-xs mb-4">{address}</p>
          <p className="text-xs">Starting at</p>
          <p className="font-bold text-lg">{price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Card;

{
  /* <div className="my-4 flex flex-row items-center justify-between space-x-4">
    {properties?.map((property) => (
      <Link
        className="w-1/5 bg-gray-200 rounded-md"
        target="_blank"
        href={`https://www.universityliving.com/${property.countrySlug}/${property.citySlug}/property/${property.slug}`}
      >
        <div className="rounded-md overflow-hidden w-full h-52 relative">
          <Image src={property.media?.[0].url} fill />
        </div>
        <div className="p-2">
          <p className="font-bold mt-2">{property.name}</p>
          <p className="text-xs mb-4">
            {property.city}, {property.country}
          </p>
          <p className="text-xs">Starting at</p>
          <p className="font-bold text-lg">{property.displayPrice}</p>
        </div>
      </Link>
    ))}
  </div> */
}
