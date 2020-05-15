class Api::V1::ItineraryItemsController < ApplicationController
  before_action :authenticate_admin!

  def destroy
    ItineraryItem.destroy(params[:id])
  end 

end