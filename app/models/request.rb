class Request < ApplicationRecord
  belongs_to :user
  belongs_to :neighborhood
  belongs_to :price_range
  has_many :itinerary_items
  has_many :contacts, inverse_of: :request
  has_one :review

  accepts_nested_attributes_for :contacts, reject_if: proc { |attributes| attributes['phone'].blank? }

  validates :party_size, presence: true
 
end
