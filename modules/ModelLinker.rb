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
					if vl_group[:name] == variable.get_long_vl_name
						vl_group[:childgroups].each do |device_type|								
							if device_type[:group][0][:device] == variable.get_prefix_device_name
									variable_xml.at_css('SystemModelGroup').content = 
										[
											vl_group[:name], 
											device_type[:group][0][:name],
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