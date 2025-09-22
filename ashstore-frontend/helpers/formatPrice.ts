type PriceType = string | number;

const formatPrice = (price: PriceType) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numericPrice)) return "Invalid Price";

    return Intl.NumberFormat("en-PK", {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
    }).format(numericPrice);
};

export default formatPrice;
