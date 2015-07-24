require '.\spec_helper'

require '../modules/parse_xml'


describe 'module XML' do

	before :all do
    	@file = XML::XML.new(File.expand_path("../files/xml/variables_spec.xml"))
    	@variables = XML::Variables.new(@file).variables

	end

	describe 'Variables' do

		it { @file.get_doc.should be_a Nokogiri::XML::Document }
		
		it { expect(@variables).to be_a_kind_of(Array) }
				
		it 'variable should have valid structure' do
			@variables.each do |variable|
					expect( variable.voltage_level ).not_to be_nil
					expect( variable.vl_name ).not_to be_nil
					expect( variable.panel ).not_to be_nil
					expect( variable.system ).not_to be_nil
					expect( variable.ka_name ).not_to be_nil
					expect( variable.signal_name ).not_to be_nil
					expect( variable.symbaddr ).not_to be_nil
					expect( variable.variable_name ).not_to be_nil
					expect( variable.signal_short_name ).not_to be_nil
			end	
		end

	end



end
