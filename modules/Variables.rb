
class Variables	
	attr_reader 	:variables, :errors

	def initialize(file)	
		@errors = []
		@doc 		= file.get_doc
		@variables 	= build_variables_list						
	end			
	def expression
		"Subject/Apartment/Variable"
	end

	def get_nodes(xml)
		xml.xpath(expression)
	end
	def set_error(name)
		@errors << name
	end
	def build_variables_list
		get_nodes(@doc).map do |i|
			name_content = i.at_css('Name').nil? ? "" : i.at_css('Name').content
			symbaddr_content = i.at_css('SymbAddr').nil? ? "" : i.at_css('SymbAddr').content
			tagname_content = i.at_css('Tagname').nil? ? "" : i.at_css('Tagname').content
			if tagname_content.nil? || tagname_content.empty?
				set_error(name_content)	
				nil						
			else
				variable = 	{
								name: name_content,
								symbaddr: symbaddr_content,
								tagname: tagname_content						
							}
											
				Variable.new(variable)		
			end		
		end.compact			
	end	
	
end
