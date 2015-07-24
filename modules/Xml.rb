
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