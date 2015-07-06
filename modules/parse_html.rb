#coding: UTF-8

require 'json'
require 'nokogiri'
require 'uri'
require 'open-uri'


module ParseHTML

    @@url = "files/html/site_medical.htm"  
    #url = 'http://er.zdravmo.ru/registratu/3/Himki_gorodskoi_okrug/khimkinskaya_detskaya_gorodskaya_poliklinika_4_pediatricheskoe_otdelenie/'    
    #page = open(url)
    
    @@show_medical = []   
    @@doc = Nokogiri::HTML(open(@@url))    
	
	def self.prepeare_array
	
		@@doc.css('.scroll-pane').css('li a').each do |link|			
			link.text.strip.split(/\s{5,}/).each_slice(2) do  |s|				
				@@show_medical << {
					name: s[0],
					count: s[1].scan(/\d+/).flatten.join.to_i,
					href:   "#{URI.parse(@@url).host} #{link[:href]}"
				} unless link.text.include?('Записаться')			
			end
		end
	end
	
	def self.show_results
		self.prepeare_array
		@@show_medical.each {|h| puts  "#{h[:name]} - #{h[:count]} - #{h[:href]}"}
	end
end
	




