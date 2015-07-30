
class Archives
	attr_reader 	:archives, :errors

	def initialize(file)	
		@errors = []
		@doc 		= file.get_doc
		@archives 	= build_archives_list						
	end	

	def expression
		"Subject/Apartment/Archives"
	end

	def expression_archivvars
		"Subject/Apartment/Archives/ArchivVars"
	end

	def get_nodes(xml)
		xml.xpath(expression)
	end

	def set_error(name)
		@errors << name
	end

	def build_archives_list
		get_nodes(@doc).map do |i|
			shortName_content = i.at_css('ShortName').nil? ? "" : i.at_css('ShortName').content
			longName_content = i.at_css('LongName').nil? ? "" : i.at_css('LongName').content

			#archiv_vars = @doc.xpath("//Subject/Apartment/Archives[contains(ShortName, shortName_content)]/ArchivVars/Variable").first.text #collect {|elem| elem.text}
			archiv_vars = i.css('ArchivVars/Variable').collect {|elem| elem.text}
			archives = 	{
							ShortName: shortName_content,								
							LongName: longName_content,
							ArchiveVars: archiv_vars 					
						}	
				
		end
	end		

	def verify_variables(variables_list)

		not_found = []

		@archives.each do |archive|						

			archive[:ArchiveVars].each do |archive_var|
				
				not_found << archive_var unless variables_list.to_arr.include?(archive_var)

			end

		end

		return not_found

	end
	
end
