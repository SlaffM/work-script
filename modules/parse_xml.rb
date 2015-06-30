#coding: UTF-8

require 'json'
require 'active_support'
require 'nokogiri'
require 'uri'
require 'open-uri'
require 'axlsx'
require 'active_support/core_ext/hash'
require 'uuid'

module XML	
		
	class XML

		attr_accessor :file, :doc

		def initialize(file_path)			
			@file = file_path
			@doc = get_doc			
		end

		def get_doc			
			file = File.open(@file, "r:UTF-8")				
			doc = Nokogiri::XML(file)			
			file.close
			return doc		
		end

		def write_document_to_xml(doc)
			file=File.new(@file.downcase.gsub(".xml",".result.xml"),"w")
			file.write doc.to_xml(encoding: 'UTF-8')
			file.close	
		end
	end


	class Variable

		attr_accessor :voltage_level, :vl_name, :panel, :system, :ka_name, :signal_name, :symbaddr, :variable_name, :signal_short_name

		def initialize(variable)						
			create_headers(variable)
		end

		def create_headers(variable)			
		
			tag_name = variable[:tagname]	

			signal_short_name = variable[:name][variable[:name].rindex(".")+1..-1] if variable[:name].include?(".")							
							
			@voltage_level 		= tag_name[0, 8].strip 						#класс напряжения
			@vl_name 			= tag_name[8, 27].strip						#название линии
			@panel 				= tag_name[35, 8].strip						#номер панели
			@system 			= tag_name[43, 8].strip 					#система
			@ka_name			= clear_mip_tag(tag_name[51, 27].strip)		#название ка (устройства)
			@signal_name 		= tag_name[78, 48].strip 					#навзвание сигнала
			@symbaddr 			= variable[:symbaddr]						#адрес 61850 (symbaddr)
			@variable_name 		= variable[:name]							#адрес переменной (name) V460
			@signal_short_name 	= signal_short_name							#короткое название сигнала
			
		end	

		def clear_mip_tag(tag)	
			if tag.include?("МИП")
				tag[/\(.{1,}\)/].gsub(/\(|\)/, '')
			else
				tag
			end
		end

		def is_variable_ready?
			!@variable_name.start_with?("INT.") && @variable_name.include?("!") && @variable_name.end_with?(".P")
		end

		def get_vl_name			
			if @system == "МПРЗА"
				if @symbaddr.include?("MD") 
					"#{@voltage_level} #{@vl_name} #{@ka_name}"
				else
					"#{@voltage_level} #{@vl_name}"
				end
			elsif @system == "АСУ ТП"
				if @ka_name.include?("ВЛ") 
					"#{@voltage_level} #{@vl_name}"
				else
					"#{@voltage_level} #{@vl_name} #{@ka_name}"
				end
			else
				"Undefine"
			end
		end


		def get_device_name			
			if @system == "АСУ ТП"
				"МИП"
			elsif @system == "МПРЗА"
				"РЗА"
			else
				"Undefine"
			end
		end

		def get_prefix_device_name
			@variable_name[0..@variable_name.rindex(".")-1]
		end

	end


	class Variables	

		attr_accessor 	:variables
	
		def initialize(file)	
			@doc 		= file.get_doc
			@variables 	= build_variables_list						
		end			

		def expression
			"Subject/Apartment/Variable"
		end
	
		def get_nodes(xml)
			xml.xpath(expression)
		end

		def build_variables_list		
										
			#variables = []

			get_nodes(@doc).map do |i|				
				
				name_content = i.at_css('Name').nil? ? "" : i.at_css('Name').content
				symbaddr_content = i.at_css('SymbAddr').nil? ? "" : i.at_css('SymbAddr').content
				tagname_content = i.at_css('Tagname').nil? ? "" : i.at_css('Tagname').content				
								
				variable = 	{
								name: name_content,
								symbaddr: symbaddr_content,
								tagname: tagname_content						
							}	
											
				Variable.new(variable)				

			end			

		end	
		
	end
	
	
	class EquipModel
	
		attr_accessor 	:file
		attr_reader 	:variables
	
		def initialize(file="../files/xml/equip_model.xml")			
			@file= file	

		end				
	
		def expression
			"Subject/Apartment/SystemModel/Model"
		end
	
		def get_nodes(xml)
			xml.xpath(expression)
		end
		
		def building_list		
							
			doc = Nokogiri::XML(File.open(@file, "r:UTF-8"))
			h={}			
			h = get_nodes(doc).map { |model|			
				Hash.from_xml(model.to_xml)
			}		
			
			#puts JSON.pretty_generate(h)
			
			serialized = JSON.generate(h)
			new_hash = JSON.parse(serialized, :symbolize_names => true)

			
			return new_hash
		end	
		
		def xml_show(xml)
			xml.xpath("Subject/Apartment/SystemModel/Model")
		end		

	end

	class ModelCreator

		def initialize(model, file)
			@model = model							
			@doc = file.get_doc			
		end

		def link_variables_to_model			

			@model.each do |vl_group|				

				get_nodes(@doc).each do |variable_xml|
					variable_name = variable_xml.at_css('Name').content
					if variable_name.end_with?("Ia", "Ib", "Ic", "Ua", "Ub", "Uc", "P")
						variable_symbaddr = variable_xml.at_css('SymbAddr').content
						variable_tagname = 	variable_xml.at_css('Tagname').content
						variable_tag = 	{
											name: variable_name,
											symbaddr: variable_symbaddr,
											tagname: variable_tagname, 
										}												
						variable = Variable.new(variable_tag)
						if vl_group[:name] == variable.get_vl_name
							vl_group[:childgroups].each do |device_type|
								if device_type[:group][:device] == variable.get_prefix_device_name
										variable_xml.at_css('SystemModelGroup').content = 
											[
												vl_group[:name], 
												device_type[:group][:name],
												variable.signal_short_name
											].join(".")
									
								end
							end										
						end
					end
				end				
				
			end

			show_changes_in_doc_smg(@doc)

			return @doc
		end

		def show_changes_in_doc_smg(doc)
			get_nodes(doc).each do |variable|															
					variable_name = variable.at_css('Name').content
					variable_smg = variable.at_css('SystemModelGroup').content
					p "#{variable_name} - #{variable_smg}" unless variable_smg.empty?
			end
		end

		def expression
			"Subject/Apartment/Variable"
		end
	
		def get_nodes(xml)
			xml.xpath(expression)
		end	

	end


	class ModelHelper	
		
		def initialize(variables)

			@variables = variables.select { |variable| variable if variable.is_variable_ready? }	
			@list_groups = []
			@uuid = UUID.new
		end

		def prepare_list_groups	
			@list_groups = @variables.map { |variable| { name: variable.get_vl_name, guid: @uuid.generate } }.uniq			
		end

		def prepare_model
			@list_groups.each do |vl_groups| 
				
				#vl_groups[:childgroups] = []
				num = 1
				vl_groups[:childgroups] = 	@variables.map do |variable|

												if vl_groups[:name] == variable.get_vl_name
													
													group = {}
													group[:group] = { 
																		name: 			get_device_name(variable.get_device_name, num),    #"#{variable.get_device_name}",
																		guid: 			@uuid.generate,
																		device: 		variable.get_prefix_device_name,
																		childgroups: 	get_ti_struct
																	}
													num += 1
													group
													#vl_groups[:childgroups] <<	group
												end	
											end	
=begin

				num = 1

				vl_groups[:childgroups].each do |vl|
					p vl[:group][:name]
					vl_group_name = vl[:group][:name]

					vl[:group][:name] = vl_group_name.include?("МИП") ? "#{vl_group_name}_1" : "#{vl_group_name}_#{num}"

					num += 1
				end
=end

			end
		end

		def get_device_name(name, num)
			name.include?("МИП") ? "#{name}_1" : "#{name}_#{num}"
		end

		def build_model	

			prepare_list_groups

			prepare_model

		end				

		def ti_list
			['Ia', 'Ib', 'Ic', 'Ua', 'Ub', 'Uc', 'P']
		end

		def get_ti_struct			
			ti_list.map { |elem| {group:{name: elem, guid: @uuid.generate}} }			
		end

	end

end


file = XML::XML.new("../files/xml/1.XML")

variables = XML::Variables.new(file).variables

model_helper = XML::ModelHelper.new(variables).build_model
model_helper.each {|elem| p elem}

model = XML::ModelCreator.new(model_helper, file).link_variables_to_model

file.write_document_to_xml model