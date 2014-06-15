package controllers

import play.api._
import play.api.mvc._
import utils.ICalParser

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def icalParser = Action {
    val icalParser = new ICalParser()
    val jsonString = icalParser.parseIcalFile("events.ical")


    Ok(jsonString)
  }

}