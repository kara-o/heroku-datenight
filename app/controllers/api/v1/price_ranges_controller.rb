class Api::V1::PriceRangesController < ApplicationController

  def index
    prices = PriceRange.all  
    render json: prices
  end 

end
