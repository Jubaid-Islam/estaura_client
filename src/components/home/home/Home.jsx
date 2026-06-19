import CustomerReview from "../customer-review/CustomerReview";
import FeaturedAgent from "../featured-agent/FeaturedAgent";
import FeaturedBuy from "../featured-buy/FeaturedBuy";
import AllCities from "../featured-cities/FeaturedlCities";
import FeaturedRent from "../featured-rent/FeaturedRent";
import FeaturedSell from "../featured-sell/FeaturedSell";

import Hero from "../hero/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Hero></Hero>
      <AllCities></AllCities>
      <FeaturedRent></FeaturedRent>
      <FeaturedBuy></FeaturedBuy>
      <FeaturedSell></FeaturedSell>
      <FeaturedAgent></FeaturedAgent>
      <CustomerReview></CustomerReview>

    </div>
  );
}