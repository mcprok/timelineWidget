package controllers

import play.api._
import play.api.mvc._
import utils.ICalParser

object Application extends Controller {

  def index = Action {
    Redirect("/timeline")
  }

  def icalParser = Action {
    val icalParser = new ICalParser()
    val jsonString = icalParser.parseIcalFile("events.ical")

    Ok(jsonString)
  }

  def timeline = Action {
    Ok(views.html.timeline("timeline"))
  }

}