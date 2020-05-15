class CreateRequests < ActiveRecord::Migration[6.0]
  def change
    create_table :requests do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.integer :neighborhood_id
      t.integer :party_size
      t.integer :price_range_id
      t.text :notes
      t.integer :user_id
      t.boolean :fulfilled, default: 'false'
      t.boolean :cancelled, default: 'false'

      t.timestamps
    end
  end
end
