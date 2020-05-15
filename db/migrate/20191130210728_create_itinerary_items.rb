class CreateItineraryItems < ActiveRecord::Migration[6.0]
  def change
    create_table :itinerary_items do |t|
      t.integer :request_id
      t.datetime :arrival_time
      t.integer :duration
      t.string :address
      t.string :place
      t.text :blurb
      t.string :res_link, null: true
      t.string :make_res_link, null: true
      t.string :map_iframe_url
      t.string :map_url
    end
  end
end
