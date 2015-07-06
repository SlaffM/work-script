#coding: UTF-8

require 'json'
require 'active_support'
require 'nokogiri'
require 'uri'
require 'open-uri'
require 'axlsx'
require 'active_support/core_ext/hash'
require 'active_support/core_ext/hash/conversions'
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

		def eql?(name)
			get_vl_name == name
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

		def initialize(model, file)
					
			@doc 	= file.get_doc
			@model 	= model
		end				
			
		def get_ready_model
			doc_template = @doc.root.children.at_css('Apartment/SystemModel/Model/Groups') 

			group_child = builder_xml_from_model.doc.root.children

			doc_template.add_child group_child

			return @doc			
		end

		def process_array(label,array,xml)
			array.each do |hash|
			    xml.send(label) do                 # Create an element named for the label
			      hash.each do |key,value|
			        if value.is_a?(Array)
			          process_array(key,value,xml) # Recurse
			        else			        	
			          xml.send(key,value) unless key == :device         # Create <key>value</key> (using variables)
			        end
			      end
			    end
			  end
		end
		
		def builder_xml_from_model
			builder = Nokogiri::XML::Builder.new do |xml|
		  		xml.root do                           # Wrap everything in one element.
		    		process_array('group', @model, xml)  # Start the recursion with a custom name.
		  		end
			end
		end

	end

	class ModelLinker

		def initialize(model, file)
			@model = model							
			@doc = file.get_doc			
		end

		def link			

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
			@uuid = UUID.new
			@variables = select_variables variables				
			@list_groups = get_list_groups			
		end		

		def prepare_model
			@list_groups.each do |vl_group|
				vl_group[:guid]			= @uuid.generate
				vl_group[:childgroups] 	= get_device_group(vl_group)
			end
		end

		private
		
			def change_device_name(name, num)
				name.include?("МИП") ? "#{name}_1" : "#{name}_#{num}"
			end		
	
			def ti_list
				['Ia', 'Ib', 'Ic', 'Ua', 'Ub', 'Uc', 'P']
			end
	
			def get_ti_struct			
				ti_list.map { |elem| {group:[{name: elem, guid: @uuid.generate}]} }			
			end

			def select_variables(variables)
				variables.select { |variable| variable if variable.is_variable_ready? }
			end
	
			def get_list_groups	
				@variables.map { |variable| { name: variable.get_vl_name, guid: "", childgroups: [] } }.uniq
			end

			def get_device_group(vl_group)
				group = @variables.map { |variable| create_device(variable) if variable.eql?(vl_group[:name]) }.compact
				
				num = 1
				group.each do |device|					
					device[:group][0][:name] = change_device_name(device[:group][0][:name], num)
					num += 1
				end				
			end			
	
			def create_device(variable)			
				group 				= 	{ 	group: [] }
				group[:group][0] 	= 	{ 
											name: 			variable.get_device_name,
											guid: 			@uuid.generate,
											device: 		variable.get_prefix_device_name,
											childgroups: 	get_ti_struct
										}
				return group
			end

	end

end


file_variables = XML::XML.new(File.expand_path "../../files/xml/1.XML", __FILE__)
file_equipmodel = XML::XML.new(File.expand_path "../../files/xml/template_equipmodel.xml", __FILE__)


variables = XML::Variables.new(file_variables).variables

#variables.each {|elem| p elem}

model_helper = XML::ModelHelper.new(variables).prepare_model

model_helper.each {|elem| p elem}

#link_variables = XML::ModelLinker.new(model_helper, file_variables).link

#file_variables.write_document_to_xml link_variables

#equip_model = XML::EquipModel.new(model_helper, file_equipmodel).building_list
#file_equipmodel.write_document_to_xml equip_model