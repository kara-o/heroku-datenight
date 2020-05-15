class AdminSerializer < ActiveModel::Serializer
  attributes :id, :email, :admin

  def admin
    self.object.class.name == "Admin"
  end 

end