class Api::V1::AdminAuth::SessionsController < DeviseTokenAuth::SessionsController
  protected

  def render_create_success
    render json: {
      data: resource_data(resource_json: @resource.token_validation_response)
    }, scope: current_admin
  end
end