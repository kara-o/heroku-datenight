require 'nokogiri'
require 'open-uri'

class Api::V1::ScrapesController < ApplicationController

  def get_names
    neighborhood = 'NOT VALID'

    if params[:location] == 'Greenwood / Greenlake / Phinney Ridge'
      neighborhood = '&neighborhoodids%5B%5D=740&neighborhoodids%5B%5D=2159&neighborhoodids%5B%5D=9149'
    elsif params[:location] == 'Ballard / Fremont / Wallingford'
      neighborhood = '&neighborhoodids%5B%5D=121&neighborhoodids%5B%5D=475&neighborhoodids%5B%5D=821'
    elsif params[:location] == 'Downtown'
      neighborhood = '&neighborhoodids%5B%5D=58'
    elsif params[:location] == 'Capitol Hill'
      neighborhood = '&neighborhoodids%5B%5D=130'
    # elsif params[:location] == 'bell/pp'
    #   neighborhood = '&neighborhoodids%5B%5D=471'
    elsif params[:location] == 'Queen Anne / Magnolia'
      neighborhood = '&neighborhoodids%5B%5D=458&neighborhoodids%5B%5D=5207'
    # elsif params[:location] == 'w/f'
    #   neighborhood = '&neighborhoodids%5B%5D=121&neighborhoodids%5B%5D=821'
    elsif params[:location] == 'All'
      neighborhood = '&regionids%5B%5D=1'
    end
    
    doc = Nokogiri::HTML(open('https://www.opentable.com/s/?covers=2&currentview=list&datetime=' + params[:time] + '+19%3A00&size=100&sort=Popularity' + neighborhood), nil, "UTF-8")
    name_divs = doc.css('.rest-row-header')
    names = []
    2.times do 
      name_divs.each do |div|
        link = div.css('a').collect{|link| link['href']}[0]
        name = div.css('.rest-row-name-text').text
        names << { link: link, name: name }
      end
      doc = Nokogiri::HTML(open('https://www.opentable.com/s/?covers=2&currentview=list&datetime=' + params[:time] + '+19%3A00&size=100&sort=Popularity' + neighborhood + '&from=100'), nil, "UTF-8")
    end
    render json: names
  end 

  def single_page
    link = params[:link]
    doc = Nokogiri::HTML(open(link), nil, "UTF-8")
    name = doc.css('#overview-section > div._28eeaf1d > div._5d321873 > h1').inner_text
    neighborhood = doc.css('#js-page > div._54265dcc.d210ec04 > aside > div.bfdedf6a > div:nth-child(2) > div > div._8ecd35dd > div > div._1e466fbf > div:nth-child(2) > div > div.df8add00 > div.e7ff71b6.b2f6d1a4 > a').inner_text
    blurb = doc.css('#overview-section > div._3c23fa05 > div > div > div').inner_text
    cuisine = doc.css('#overview-section > div._28eeaf1d > div.d3ba82e4 > div:nth-child(3) > div > div.df8add00 > div > span').inner_text
    price = doc.css('#overview-section > div._28eeaf1d > div.d3ba82e4 > div:nth-child(2) > div > div.df8add00 > div > span').inner_text
    address = doc.css('#js-page > div._54265dcc.d210ec04 > aside > div.bfdedf6a > div:nth-child(2) > div > div._8ecd35dd > div > div.e9508c55 > div > div > div > div.df8add00 > div > a > span').inner_text
    map_url = doc.css('#js-page > div._54265dcc.d210ec04 > aside > div.bfdedf6a > div:nth-child(2) > div > div._8ecd35dd > div > div.e9508c55 > div > div > div > div.df8add00 > div > a').collect{|link| link['href']}[0]
    info = {name: name, neighborhood: neighborhood, cuisine: cuisine, price: price, blurb: blurb, address: address, make_res_link: link, map_url: map_url}
    render json: info

  end 

end

# &neighborhoodids%5B%5D=740&neighborhoodids%5B%5D=2159&neighborhoodids%5B%5D=9149  #P/G/G 1
# &neighborhoodids%5B%5D=121&neighborhoodids%5B%5D=475 #F/B 2
# &neighborhoodids%5B%5D=58 #D 3
# &neighborhoodids%5B%5D=130 #CH 4
# &neighborhoodids%5B%5D=471 #B/PP 5
# &neighborhoodids%5B%5D=458&neighborhoodids%5B%5D=5207 #QA/M 6
# &neighborhoodids%5B%5D=121&neighborhoodids%5B%5D=821 #W/F 7