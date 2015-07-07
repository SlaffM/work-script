require '.\spec_helper'

require '../modules/parse_xml'


describe 'Variables' do

	before :all do
    	@file = XML::XML.new(File.expand_path("../files/xml/variables_spec.xml"))
    	@variables = XML::Variables.new(@file)
	end

	it { @file.get_doc.should be_a Nokogiri::XML::Document }
	
	it { @variables.should be_an_instance_of(XML::Variables) }



end
