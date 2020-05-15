class Contact < ApplicationRecord
  belongs_to :request, inverse_of: :contacts
  validates_presence_of :request
end