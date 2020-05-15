class Api::V1::RequestsController < ApplicationController
  before_action :authenticate_member!

  def create
    request = Request.create(request_params)
    if request.valid?
      # TODO: Remove outer request key
      render json: { request: RequestSerializer.new(request) }, status: :created
    else 
      render json: { errors: { error_obj: request.errors.messages, full_messages: request.errors.full_messages} }, status: :not_acceptable
    end 
  end 

  def index
    if params[:user_id]
      requests = Request.where(user_id: params[:user_id]).order(:start_time)
    else
      requests = Request.order(:start_time)
    end
    render json: requests
  end 

  def show
    request = Request.find(params[:id])
    render json: { request: RequestSerializer.new(request) }
  end 

  def update
    request = Request.find(params[:id])
    if request.update(request_params)
      render json: { request: RequestSerializer.new(request) }
    else
      render json: { errors: { error_obj: request.errors.messages, full_messages: request.errors.full_messages} }, status: :not_acceptable
    end 
  end 

  def apply_package
    itin_package = ItineraryPackage.find(params[:itinerary_package_id])
    request = Request.find(params[:id])

    curr_time = request.start_time
    itin_package.itinerary_package_items.each do |pkg_item|
      ItineraryItem.create({
        request_id: params[:id],
        arrival_time: curr_time,
        duration: pkg_item.duration,
        address: pkg_item.address,
        place: pkg_item.place,
        blurb: pkg_item.blurb,
        make_res_link: pkg_item.make_res_link,
        map_url: pkg_item.map_url,
        map_iframe_url: pkg_item.map_iframe_url,
      })
      curr_time += pkg_item.duration.minutes
    end

    request = Request.find(params[:id])
    render json: { request: RequestSerializer.new(request) }
  end

  def add_single_item
    ItineraryItem.create({
      request_id: params[:id],
      arrival_time: params[:reservation_time],
      duration: 90,
      address: params[:address],
      place: params[:name],
      blurb: params[:blurb],
      make_res_link: params[:make_res_link],
      map_url: params[:map_url],
      map_iframe_url: params[:map_iframe_url],
    })
    request = Request.find(params[:id])
    render json: { request: RequestSerializer.new(request) }
  end 

  def create_review
    Review.create({
      request_id: params[:id],
      rating: params[:rating],
      feedback: params[:feedback]
    })
    request = Request.find(params[:id])
    render json: { request: RequestSerializer.new(request) }
  end

  def update_admin_review
    review = Review.find(params[:id])
    if review.update({admin_reviewed: params[:admin_reviewed]})
      render json: review
    else
      render json: { errors: { error_obj: request.errors.messages, full_messages: request.errors.full_messages} }, status: :not_acceptable
    end
  end

  private

  def request_params
    params.require(:request).permit(:start_time, :end_time, :party_size, :notes, :neighborhood_id, :price_range_id, :user_id, :cancelled, :fulfilled, :admin_addressed_cancel, contacts_attributes: [:id, :phone])
  end 

end
