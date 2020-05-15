class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  has_many :requests
  has_many :itinerary_items, through: :requests

  
  # validates :username, presence: true
  # validates :username, uniqueness: true
  # # validates :email, presence: true
  # # validates :email, uniqueness: true
  # # validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone, presence: true
  # TODO: validate phone format

  include DeviseTokenAuth::Concerns::User
end
