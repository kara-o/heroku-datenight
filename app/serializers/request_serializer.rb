class RequestSerializer < ActiveModel::Serializer
  attributes :id, :start_time, :end_time, :party_size, :neighborhood, :price_range, :fulfilled, :cancelled, :notes, :contacts, :itinerary_items, :review, :user, :admin_addressed_cancel

  def user
    user = User.find(self.object.user_id)
    return {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }
  end
  
  def neighborhood
    Neighborhood.find(self.object.neighborhood_id).name
  end

  def price_range
    PriceRange.find(self.object.price_range_id).max_amount
  end 
end