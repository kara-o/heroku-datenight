class AddAdminAddressedCancelToRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :admin_addressed_cancel, :datetime, null: true
  end
end
