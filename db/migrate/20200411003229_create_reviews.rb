class CreateReviews < ActiveRecord::Migration[6.0]
  def change
    create_table :reviews do |t|
      t.integer :rating
      t.text :feedback, null: true
      t.integer :request_id
      t.datetime :admin_reviewed, null: true
      
      t.timestamps
    end
  end
end
