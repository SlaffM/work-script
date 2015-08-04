#coding: UTF-8
$LOAD_PATH << 'modules'
require 'lib_helper'


file_variables = File.expand_path("../files/xml/1.XML", __FILE__)
#file_variables = XML.new(File.expand_path("../files/xml/1.XML", __FILE__))
#file_variables = File.expand_path("../files/xml/bad_1.XML", __FILE__)
#file_archives = XML.new(File.expand_path("../files/xml/archives.XML", __FILE__))
#file_equipmodel = XML::XML.new(File.expand_path("../files/xml/template_equipmodel.xml", __FILE__))

variables = Variables.new(file_variables).variables

variables.each {|var| p var }

#archives = Archives.new(file_archives).archives

#not_found_vars = Archives.new(file_archives).verify_variables(variables)

#not_found_vars.each {|var| p var}

#archives.each {|archive| p archive }

#model_helper = XML::ModelHelper.new(variables).prepare_model

#model_helper.each {|elem| p elem}

#modellink = XML::ModelLinker.new(model_helper, file_variables).link

#file_variables.write_document_to_xml modellink

#model_link = XML::ModelLinker.new(model_helper, file_variables).link

#file_variables.write_document_to_xml model_link

#equip_model = XML::EquipModel.new(model_helper, file_equipmodel).get_ready_model
#file_equipmodel.write_document_to_xml equip_model

#изменено #3
