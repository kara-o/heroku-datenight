class CreateItineraryPackages < ActiveRecord::Migration[6.0]
  def change
    create_table :itinerary_packages do |t|
      t.string :title
      t.integer :neighborhood_id
      t.text :blurb
      t.integer :price_range_id

      t.timestamps
    end
  end
end
