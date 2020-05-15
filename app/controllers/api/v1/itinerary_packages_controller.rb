class Api::V1::ItineraryPackagesController < ApplicationController
  before_action :authenticate_admin!

  def create
    itin_pkg = ItineraryPackage.create(itin_pkg_params)
    if itin_pkg.valid?
      render json: itin_pkg, status: :created
    else
      render json: { errors: { error_obj: itin_pkg.errors.messages, full_messages: itin_pkg.errors.full_messages} }, status: :not_acceptable
    end 
  end

  def index
    itin_pkgs = ItineraryPackage.all
    render json: itin_pkgs
  end

  def show
    itin_pkg = ItineraryPackage.find(params[:id])
    render json: itin_pkg
  end

  def update
    itin_pkg = ItineraryPackage.update(params[:id], itin_pkg_params)
    if itin_pkg.valid?
      render json: itin_pkg, status: :updated
    else
      render json: { errors: { error_obj: itin_pkg.errors.messages, full_messages: itin_pkg.errors.full_messages} }, status: :not_acceptable
    end 
  end

  private

  def itin_pkg_params
    params.require(:itinerary_package).permit(:title, :neighborhood_id, :price_range_id, :blurb)
  end

end
