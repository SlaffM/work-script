
require_relative 'Parser'
require_relative 'Variable'


class Variables	
	attr_reader 	:variables

	def initialize(file)	
		#@errors = []
		@file = file
		#@doc 		= file.get_doc
		@variables = build_variables_list
	end	

	def build_variables_list
		variables = []
		
		Parser.new(Nokogiri::XML.Reader(open(@file))) do
			
			variable = {}			
			inside_element 'Variable' do

				for_element 'Name' 		do variable[:name] = inner_xml end
				for_element 'SymbAddr' 	do variable[:symbaddr] = inner_xml end
				for_element 'Tagname' 	do variable[:tagname] = inner_xml end

			end

			variables << Variable.new(variable) unless variable.empty?

		end

		return variables

	end

	def to_arr()		build_variables_list.map{|var| var.variable_name};	end
	
end




#file = File.expand_path("../../files/xml/bad_1.XML", __FILE__)

#variables = Variables.new(file).variables

#variables.each {|var| p var }