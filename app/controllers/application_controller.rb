class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  
  respond_to :json
  devise_token_auth_group :member, contains: [:user, :admin]

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :phone])
  end
  
  # before_action :authorized

  # def encode_token(payload)
  #   # TODO: more secure secret key
  #   JWT.encode(payload, 's3cr3t_k3y')
  # end 

  # def auth_header
  #   request.headers['Authorization']
  # end
  
  # def decoded_token
  #   if auth_header
  #     token = auth_header.split(' ')[1]
  #     begin
  #       # TODO: more secure secret key
  #       JWT.decode(token, 's3cr3t_k3y', true, algorithm: 'HS256')
  #     rescue JWT::DecodeError
  #       nil
  #     end 
  #   end 
  # end 

  # def current_user
  #   if decoded_token 
  #     user_id = decoded_token[0]['user_id']
  #     user = User.find(user_id)
  #   end 
  # end 

  # def logged_in?
  #   !!current_user
  # end 

  # def authorized
  #   render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
  # end
end
