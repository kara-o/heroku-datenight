class ItineraryPackageSerializer < ActiveModel::Serializer
  attributes :id, :neighborhood, :neighborhood_id, :price_range, :price_range_id, :title, :blurb, :itinerary_package_items

  def neighborhood
    Neighborhood.find(self.object.neighborhood_id).name
  end

  def price_range
    PriceRange.find(self.object.price_range_id).max_amount
  end

end
