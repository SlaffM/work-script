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
			    xml.send(label) do                 					# Create an element named for the label
			      hash.each do |key,value|
			        if value.is_a?(Array)
			          process_array(key,value,xml) 					# Recurse
			        else			        	
			          xml.send(key,value) unless key == :device     # Create <key>value</key> (using variables)
			        end
			      end
			    end
			  end
		end
		
		def builder_xml_from_model
			Nokogiri::XML::Builder.new do |xml|
		  		xml.root do                           				# Wrap everything in one element.
		    		process_array('group', @model, xml)  			# Start the recursion with a custom name.
		  		end
			end
		end

end