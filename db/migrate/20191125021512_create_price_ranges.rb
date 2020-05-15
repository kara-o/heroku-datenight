class CreatePriceRanges < ActiveRecord::Migration[6.0]
  def change
    create_table :price_ranges do |t|
      t.string :max_amount

      t.timestamps
    end
  end
end
