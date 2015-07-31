
require_relative 'Parser'
require_relative 'Variable'


class Variables	
	attr_reader 	:variables

	def initialize(file)	
		#@errors = []
		@file = file
		#@doc 		= file.get_doc
		@variables 	= build_variables_list
	end	
=begin


	def expression
		"Subject/Apartment/Variable"
	end

	def get_nodes(xml)
		xml.xpath(expression)
	end
	=end


=begin


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
=end


	def build_variables_list
		variables = []
		name_content = ""
		symbaddr_content = ""
		tagname_content = ""
		

		Parser.new(Nokogiri::XML.Reader(open(@file))) do
			
			variable = {}			
			inside_element 'Variable' do

				for_element 'Name' do name_content = inner_xml end
				for_element 'SymbAddr' do symbaddr_content = inner_xml end
				for_element 'Tagname' do tagname_content = inner_xml end

				#if tagname_content.nil? || tagname_content.empty?
				#	nil						
				#else
					variable = 	{
									name: name_content,
									symbaddr: symbaddr_content,
									tagname: tagname_content					
								}
				#end						

			end

			variables << Variable.new(variable) unless variable.empty?

		end

		return variables

	end

	def to_arr()		@variables.map{|var| var.variable_name};	end
	
end

#file = File.expand_path("../../files/xml/bad_1.XML", __FILE__)

#variables = Variables.new(file).variables

#variables.each {|var| p var }