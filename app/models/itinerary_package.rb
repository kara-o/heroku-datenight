class ItineraryPackage < ApplicationRecord
  belongs_to :neighborhood
  belongs_to :price_range
  has_many :itinerary_package_items
end
