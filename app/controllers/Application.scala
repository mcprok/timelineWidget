package controllers

import play.api._
import play.api.mvc._
import utils.ICalParser
import java.io.File

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def upload = Action(parse.multipartFormData) { request =>

    request.body.file("event").map { picture =>
      val file = new File(picture.filename)
      println(icalParser(file))
      Ok(icalParser(file))
    }.getOrElse {
      Redirect(routes.Application.index).flashing(
        "error" -> "Missing file"
      )
    }
  }

  private def icalParser(file : File) = {
    val icalParser = new ICalParser()
    val jsonString = icalParser.parseIcalFile(file)
    jsonString
  }
}