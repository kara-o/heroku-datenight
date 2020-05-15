class Api::V1::AdminAuth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  protected

  def render_create_success
    render json: {
      status: 'success',
      data: resource_data
    }, scope: current_admin
  end
end