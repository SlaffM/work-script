require '.\spec_helper'

require '../modules/parse_xml'


describe 'Check module XML.' do

	before :all do
    	@file = XML::XML.new(File.expand_path("../files/xml/variables_spec.xml"))
    	@variables = XML::Variables.new(@file).variables

	end
=begin

	describe 'Variable.' do

		it 'first should be a variable' do 
			@variables.first.should be_a XML::Variable
		end

	end
=end

	describe 'Variables.' do

		it { @file.get_doc.should be_a Nokogiri::XML::Document }
		
		it { expect(@variables).to be_a_kind_of(Array) }


		describe 'Array of variables.' do

			it 'should valid' do

				@variables.each do |variable|

					variable.should be_a XML::Variable

				end

			end
			
				

		end

	end



end
